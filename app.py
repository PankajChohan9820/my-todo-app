from flask import Flask
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from models.task_model import db
from routes.todo_route import tasks_api
from routes.todo_users import users_api
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder = 'frontend/build', static_url_path = '/')
CORS(app = app)
# app.config.from_object('config.Config')
app.config['SQLALCHEMY_DATABASE_URI'] ='postgres://bfdpjujfjdqyhl:f7dd640e7d911a2fe9f12baa3eea805a3e9df1d43a11509e10ed4ee0965ebe90@ec2-3-232-218-211.compute-1.amazonaws.com:5432/d51o4ppklis9r7'
db.init_app(app)


app.register_blueprint(tasks_api)
app.register_blueprint(users_api)


# @app.route('/')
# def serve():
#     return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run()