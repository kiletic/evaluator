import mongoose from 'mongoose';
import { AutoIncrement } from '../app';

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
	userName: String,
	task : {
		name: { type: String },
		id: { type: Number }
	},
	code: {
		content: { type: String },
		language: { type: String }
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
		default: 0 // in MB 
	},
	testcaseResults: [{
		verdict: {
			type: String,
			enum: ['Pending', 'Accepted', 'Compile Error', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Unknown', '???'],
			default: 'Pending'
		}, 
		output: { type: String },
		msg: { type: String }
	}]
});

submissionSchema.plugin(AutoIncrement, { inc_field: 'submissionId' });
const Submission = mongoose.model('Submission', submissionSchema); 

export default Submission;