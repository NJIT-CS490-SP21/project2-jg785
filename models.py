''' Import app from DB '''
from app import DB


class Person(DB.Model):
    '''
    Schema for database
    '''
    username = DB.Column(DB.String(80), primary_key=True)
    score = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username
