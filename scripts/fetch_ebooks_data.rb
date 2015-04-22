#!/usr/bin/env ruby

require 'date'
require 'net/http'
require 'nokogiri'
require 'json'
require 'thread'
require 'pry'

page_start = 1
page_end = 5800
packages = []
package = []
package_size = 100
threads = []

semaphore = Mutex.new
books = []
books_dt = []

(page_start..page_end).each do |id|
  package << id
  if package.size == package_size or id == page_end
    packages << package
    package = []
  end
end

packages.each do |p|
  threads << Thread.new {
    p.each do |id|
      uri = URI("http://it-ebooks.info/book/#{id}/")
      res = Net::HTTP.get_response(uri)
      next unless res.code.to_i == 200
      doc = Nokogiri::HTML(res.body)
      name = doc.css('[itemprop=name]').first.text.strip
      image = doc.css('[itemprop=image]').first.attributes["src"].value.strip
      description = doc.css('[itemprop=description]').first.children.to_html
      publisher = doc.css('[itemprop=publisher]').first.text.strip
      author = doc.css('[itemprop=author]').first.text.strip
      isbn = doc.css('[itemprop=isbn]').first.text.strip
      datePublished = doc.css('[itemprop=datePublished]').first.text.strip
      numberOfPages = doc.css('[itemprop=numberOfPages]').first.text.strip
      inLanguage = doc.css('[itemprop=inLanguage]').first.text.strip
      bookFormat = doc.css('[itemprop=bookFormat]').first.text.strip
      fileSize = doc.css('td td td:contains("File size:")').first.next_element.text.strip
      download = doc.css('td td td:contains("Download:")').first.next_element.css('a').first.attributes["href"].text

      book = {
        'id' => id,
        'name' => name.force_encoding("ISO-8859-1").encode("UTF-8"),
        'image' => image,
        'description' => description.force_encoding("ISO-8859-1").encode("UTF-8"),
        'publisher' => publisher,
        'author' => author.force_encoding("ISO-8859-1").encode("UTF-8"),
        'isbn' => isbn,
        'datePublished' => datePublished,
        'numberOfPages' => numberOfPages,
        'inLanguage' => inLanguage,
        'bookFormat' => bookFormat,
        'fileSize' => fileSize,
        'download' => download
      }
      book_dt = [
        book['id'],
        book['name'],
        book['image'],
        '', #book['description'],
        book['publisher'],
        book['author'],
        book['isbn'],
        book['datePublished'],
        book['numberOfPages'],
        '', #book['inLanguage'],
        '', #book['bookFormat'],
        '', #book['fileSize'],
        '' #'<a target="_blank" href="' + book['download'] + '">Link</a>'
      ]
      begin
        test_json = book.to_json
        puts "#{id} => #{name}"
        semaphore.synchronize {
          books << book
          books_dt << book_dt
        }
      rescue => ex
        puts "[ERROR] #{id} => #{name} #{ex.message}"
      end
    end
  }
end
threads.each(&:join)

puts 'Sorting...'
books.sort! { |x, y| x['id'] <=> y['id'] }
books_dt.sort! { |x, y| x.first <=> y.first }
books_dt = { "data" => books_dt }

date = Date.today.strftime('%F')

file = File.open("ebooks-#{date}.json", 'w+')
file.write(books.to_json)
file.close

file = File.open("ebooks_dt-#{date}.json", 'w+')
file.write(books_dt.to_json)
file.close
