import mongoose from 'mongoose';
import { AutoIncrement } from '../app';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	_id: Number,
	name: String,
	text : String,
	inputText: String,
	outputText: String
}, { _id: false });

taskSchema.plugin(AutoIncrement);
const Task = mongoose.model('Task', taskSchema); 

export default Task;
