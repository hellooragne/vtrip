
from urllib import urlencode
from HttpClient import HttpClient

class HuanChat(object):

    def __init__(self):
        self.httpobj = HttpClient()
        self.url = 'https://a1.easemob.com/helloorange/vtrip/chatgroups'
        pass

    def GroupAdd(self, group_name):
        body = '{"groupname":"%s","desc":"server create group","public":true,"approval":true,"owner":"helloorange","maxusers":300}'\
                % (group_name)
        header = {"Authorization": "Bearer YWMtXGXVLIQxEeSGxB9SC9-JFQAAAUuB-hqPfkJ6BcaM87M5jAEa4SCrWHXKPKk"}
        data = self.httpobj.HttpPost(self.url, 30, body, header)
        print body
        print data

    def GroupGet(self):
        header = {"Authorization": "Bearer YWMtXGXVLIQxEeSGxB9SC9-JFQAAAUuB-hqPfkJ6BcaM87M5jAEa4SCrWHXKPKk"}

        data = self.httpobj.HttpGet(self.url, 30, headers=header)
        print data
        return data


if __name__ == "__main__":
    HuanChatObj = HuanChat()
    #HuanChatObj.GroupAdd('mmmmmmmm')
    HuanChatObj.GroupGet()
