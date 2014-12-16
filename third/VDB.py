import pymongo

class VDB(object):
    def __init__(self):
        self.connection=pymongo.Connection('localhost',27017)
        self.db = self.connection.gis

        pass

    def InsertSubway(self, data):
        self.collection = self.db.subway
        self.collection.insert(data);
        pass

    def Insert(self, data):
        for d in data:
            self.InsertSubway(d)


if __name__ == "__main__":
    VDBobj = VDB()
    VDBobj.InsertSubway({"test":"xxxx", "hello":{"name":"124", "sex":345}})
