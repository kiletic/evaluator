import mongoose from 'mongoose';
import { AutoIncrement } from '../app';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	name: String,
	statement: String,
	inputText: String,
	outputText: String,
	timelimit: {
		type: Number,
		default: 2000 // in ms
	},
	memorylimit: {
		type: Number,
		default: 256 // in MB 
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
});

taskSchema.plugin(AutoIncrement, { inc_field: 'taskId' });
const Task = mongoose.model('Task', taskSchema); 

export default Task;
