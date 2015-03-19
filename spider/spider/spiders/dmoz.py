from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
import pymongo
import json
from bson.objectid import ObjectId


class VDB(object):
    def __init__(self):
        self.connection=pymongo.Connection('localhost',27017)
        self.db = self.connection.vtrip

        self.j_len = len('http://u.ctrip.com/union/CtripRedirect.aspx?TypeID=2&Allianceid=29637&sid=468701&OUID=&jumpUrl=')
        self.j_id = []

        pass

    def InsertSubway(self, data):
        collection = self.db.special_offer
        collection.insert(data);
        pass

    def Insert(self, data):
        for d in data:
            self.InsertSubway(d)

    def Find(self, date, start_url):
        print '-------------------'
        print date
        j_date = json.loads(date)
        try:
            j_date['_id'] =  ObjectId(j_date['_id'])
        except Exception,e:
            pass

        self.items = self.db.special_offer.find(j_date)

        for item in self.items:
            if (item['url'][-1] == 'l'):
                start_url.append(item['url'])
            else:
                start_url.append(item['url'][0:-1])

            self.j_id.append(item['_id'])
            print item['url']

        print 'get url len' + str(len(start_url))

    def Update(self, index, data):
        u_id = self.j_id[index]
        #self.db.special_offer.update({"_id": u_id}, {"$set": {"crawl.pricture": data}})
        self.db.special_offer.update({"_id": u_id}, {"$set": {"type": "travelling"}})




class DmozSpider(BaseSpider):
    name = "dmoz"
    allowed_domains = ["dmoz.org"]


    def __init__(self, *args, **kwargs):
        self.start_urls = [

        ]

        super(DmozSpider, self).__init__(*args, **kwargs)
        self.date = [kwargs.get('date')]
        print self.date
        self.VDBobj = VDB()
        self.VDBobj.Find(self.date[0], self.start_urls)

    def find(self, s):
        for index in range(len(self.start_urls)):
            if s in self.start_urls[index]:
                return index
        return -1


    def parse(self, response):
        #index = self.find(response.url)
        index = self.start_urls.index(response.url)

        print index

        if index < 0:
            print 'index < 0'
            return

        #filename = response.url.split("/")[-2]
        #open(filename, 'wb').write(response.body)

        hxs = HtmlXPathSelector(response)

        sites = hxs.xpath('//ul/li')
        titles = hxs.xpath('//title/text()')
        urls = hxs.xpath('//div[@class="small_photo_wrap"]/ul/li/a/img/@data-big-url')
        url  = urls.extract()
        self.VDBobj.Update(index, url)
        if (len(url) == 0):
            urls = hxs.xpath('//div[@class="product_feature"]//img/@src')
            url  = urls.extract()
            self.VDBobj.Update(index, url)
        if (len(url) == 0):
            urls = hxs.xpath('//div[@class="hot_recommend"]//img/@src')
            url  = urls.extract()
            self.VDBobj.Update(index, url)
