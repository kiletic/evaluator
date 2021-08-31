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
	testcaseResults: [{
		verdict: {
			type: String,
			enum: ['Pending', 'Accepted', 'Compile Error', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'],
			default: 'Pending'
		}, 
		output: { type: String },
		msg: { type: String }
	}]
});

submissionSchema.plugin(AutoIncrement, { inc_field: 'submissionId' });
const Submission = mongoose.model('Submission', submissionSchema); 

export default Submission;
