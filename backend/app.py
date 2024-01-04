from flask import Flask
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from backend.models.task_model import db
from backend.routes.todo_route import tasks_api
from backend.routes.todo_users import users_api


app = Flask(__name__, static_folder = 'frontend/build')
CORS(app = app)
app.config.from_object('backend.config.Config')
db.init_app(app)


app.register_blueprint(tasks_api)
app.register_blueprint(users_api)


# Hello world to test
# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug = True)