#coding=utf-8

from urllib import urlencode
from HttpClient import HttpClient

import json

#total

class MapData(object):

    def __init__(self):
        self.httpobj = HttpClient()
        pass

    def subway_one(self, page):
        self.url  = 'api.map.baidu.com'
        url_paramter = {'query':'地铁站','region':'上海','output':'json',\
                'ak':'E6928ee8e014f6b0480fea4c4489201a', 'page_size':'20', 'page_num':page}
        url_paramter = '/place/v2/search?' + urlencode(url_paramter)
        print url_paramter
        data = self.httpobj.HttpSend(self.url, 80, 'GET', url_paramter, 10)
        j_data = json.loads(data)
        #print 'total =' + str(j_data['total']) + 'array is = ' + str(len(j_data['results']))
        return j_data

    def subway(self):
        j_data = self.subway_one('0')
        i = 1
        j = 0
        result = []

        if j_data['total'] % 20 != 0:
            j = 0
        else:
            j = 1

        while i <= (j_data['total'] / 20 + j):
            result_one = self.subway_one(str(i))
            for r in result_one['results']:
                result.append(r)
            i += 1
        print 'total = ' + str(len(result))
        print result

    def writeDb(self):
        pass

if __name__ == "__main__":
    mapobj = MapData()
    mapobj.subway()
