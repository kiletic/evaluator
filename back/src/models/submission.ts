import mongoose from 'mongoose';
import { AutoIncrement } from '../app';

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
	username: String,
	task: {
		name: String,
		id: Number
	},
	code: {
		content: String,
		language: String
	},
	result: {
		type: String,
		default: 'Pending'
	},
	timeTaken: {
		type: Number,
		default: 0 // in ms
	},
	memoryTaken: {
		type: Number,
		default: 0 // in KB 
	},
	testcaseResults: [{
		verdict: {
			type: String,
			enum: ['Pending', 'Accepted', 'Compile Error', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Unknown'],
			default: 'Pending'
		},
		timeTaken: Number,
		memoryTaken: Number
	}]
});

submissionSchema.plugin(AutoIncrement, { inc_field: 'submissionId' });
const Submission = mongoose.model('Submission', submissionSchema); 

export default Submission;
