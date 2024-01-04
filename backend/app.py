from flask import Flask
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from backend.models.task_model import db
from backend.routes.todo_route import tasks_api
from backend.routes.todo_users import users_api


app = Flask(__name__, static_folder = 'my-todo-app/frontend/build', static_url_path = '/')
CORS(app = app)
app.config.from_object('backend.config.Config')
db.init_app(app)


app.register_blueprint(tasks_api)
app.register_blueprint(users_api)


# @app.route('/')
# def serve():
#     return send_from_directory(app.static_folder, 'index.html')

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run()