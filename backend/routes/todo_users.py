from flask import Blueprint, jsonify, request
from models.task_model import db, User
users_api = Blueprint('users_api', __name__)

@users_api.route('/users', methods=['GET','POST'])
def get_users():
    try:
        if request.method=='GET':
            users = User.query.all()
            user_list = [user.to_dict() for user in users]
            return jsonify(user_list)
        elif request.method=='POST':
            data = request.get_json()
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            user = User(name=name,email=email,password=password)
            db.session.add(user)
            db.session.commit()

            return jsonify({'message': 'User added successfully'}), 200

    except Exception as e:
        return jsonify({'error':str(e)}), 404

@users_api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict())
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error':str(e)}), 404

@users_api.route('/login', methods=['POST'])
def login():
    try:
        print('Hi inside login')
        data = request.get_json()
        print(data)
        email=data['email']
        user = User.query.filter_by(email=email).first()

        if user and user.password==data['password']:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error':str(e)}), 404


@users_api.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email is already registered'}), 400

        # hashed_password = generate_password_hash(password, method='sha256')

        new_user = User(name=name, email=email, password=password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500