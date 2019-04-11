import os

from flask import Flask, request
from flask_cors import CORS

# hash -> record strings
records = {}


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app);
    app.config.from_mapping(
        SECRET_KEY='dev',
        #DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    # add record
    @app.route('/addrecord', methods=["POST"])
    def AddRecord():
        # add a new record
        print(request.form['key']);
        print(request.form['value']);
        records[request.form['key']] = request.form['value'];
        # print(key)
        # print(value)
        return "record added";

    @app.route('/getrecord/<key>', methods=["GET"])
    def GetRecord(key):
        if key in records:
            return records[key];
        else:
            return "record not exist";

    return app