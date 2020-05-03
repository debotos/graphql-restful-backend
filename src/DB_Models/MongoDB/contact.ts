import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

const ContactSchema = new Schema(
	{
		firstName: {
			type: String,
			required: 'Enter provide first name',
		},
		lastName: {
			type: String,
			required: 'Enter provide last name',
		},
		email: {
			type: String,
			required: 'Email is required',
			unique: true,
		},
		company: {
			type: String,
		},
		phone: {
			type: Number,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Contact', ContactSchema)
