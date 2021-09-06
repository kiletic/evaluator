import fs from 'fs';
import path from 'path';

const submissionPath = path.join(__dirname, '..', '..', 'local', 'submissions');

const GetSubmissionCode = async (submissionId: any) => {
	return fs.readFileSync(path.join(submissionPath, `${submissionId}`, 'solution.cpp'));
};

export { GetSubmissionCode };
