from flask import Flask
from flask_cors import CORS
from models.task_model import db
from routes.todo_route import tasks_api
from routes.todo_users import users_api


app = Flask(__name__)
CORS(app = app)
app.config.from_object('config.Config')
db.init_app(app)


app.register_blueprint(tasks_api)
app.register_blueprint(users_api)


# Hello world to test
@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug = True)