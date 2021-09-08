import mongoose from 'mongoose';
import { AutoIncrement } from '../app';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	_id: Number,
	name: String,
	text: String,
	inputText: String,
	outputText: String,
	timeLimit: {
		type: Number,
		default: 2000 // in ms
	},
	memoryLimit: {
		type: Number,
		default: 512 // in MB 
	},
	checker: {
		type: String,
		default: 'default'
	},
	testcases: [{
		input: String,
		output: String,
		note: String
	}]
}, { _id: false });

taskSchema.plugin(AutoIncrement);
const Task = mongoose.model('Task', taskSchema); 

export default Task;
