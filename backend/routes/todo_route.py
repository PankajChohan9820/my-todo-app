from flask import Blueprint, jsonify, request
from backend.models.task_model import db, Task
tasks_api = Blueprint('tasks_api', __name__)

@tasks_api.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = Task.query.all()
        task_list = [task.to_dict() for task in tasks]
        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 404

@tasks_api.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        task = Task.query.get(task_id)
        if task:
            return jsonify(task.to_dict()),200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error':str(e)}), 404

@tasks_api.route('/tasks', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        completed = data.get('completed')
        timestamp = data.get('timestamp')
        task = Task(title=title, description=description, completed=completed, timestamp=timestamp)
        db.session.add(task)
        db.session.commit()
        return jsonify({'message': 'Task added successfully', 'id': task.id}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 404

@tasks_api.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = Task.query.get(task_id)
        if task:
            data = request.get_json()
            title = data.get('title')
            description = data.get('description')
            completed = data.get('completed')
            timestamp = data.get('timestamp')

            task.title = title
            task.description = description
            task.timestamp = timestamp
            task.completed = completed
            db.session.commit()

            return jsonify({'message': 'Task updated successfully'}), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error':str(e)}), 404

@tasks_api.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return jsonify({'message': 'Task deleted successfully'}), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error':str(e)}), 404