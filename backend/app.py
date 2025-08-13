from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# PostgreSQL configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/tasks_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Task model
class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default='')
    status = db.Column(db.String(50), default='pending')
    priority = db.Column(db.String(50), default='medium')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Initialize database
with app.app_context():
    db.create_all()

# API Routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify({'success': True, 'data': [task.to_dict() for task in tasks], 'count': len(tasks)})

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'success': False, 'error': 'Title is required'}), 400

    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        priority=data.get('priority', 'medium')
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({'success': True, 'data': task.to_dict()}), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404

    data = request.get_json()
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.status = data.get('status', task.status)
    task.priority = data.get('priority', task.priority)
    db.session.commit()
    return jsonify({'success': True, 'data': task.to_dict()})

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Task deleted successfully'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total = Task.query.count()
    completed = Task.query.filter_by(status='completed').count()
    pending = Task.query.filter_by(status='pending').count()
    in_progress = Task.query.filter_by(status='in_progress').count()
    completion_rate = round((completed / total * 100) if total > 0 else 0, 1)
    return jsonify({
        'success': True,
        'data': {
            'total': total,
            'completed': completed,
            'pending': pending,
            'in_progress': in_progress,
            'completion_rate': completion_rate
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'success': True, 'message': 'API is running', 'timestamp': datetime.utcnow().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

