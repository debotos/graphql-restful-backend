import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import isEmail from 'validator/lib/isEmail'

const USER_ROLES = ['USER', 'ADMIN']

const userSchema: Schema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, unique: true, required: true },
		email: {
			type: String,
			unique: true,
			required: true,
			validate: [isEmail, 'No valid email address provided.'],
		},
		password: { type: String, required: true, minlength: 6, maxlength: 42 },
		gender: { type: String, enum: ['Female', 'Male'], default: 'Male', required: true },
		role: { type: String, enum: USER_ROLES, default: 'USER', required: true },
	},
	{ timestamps: true }
)

// Virtuals
userSchema.virtual('fullName').get(function (this: { firstName: string; lastName: string }) {
	return this.firstName + ' ' + this.lastName
})
// Static methods
userSchema.statics.findByLogin = async function (login: string) {
	let user = await this.findOne({ username: login })

	if (!user) {
		user = await this.findOne({ email: login })
	}

	return user
}
// Document middleware
userSchema.pre('remove', function (next) {
	this.model('Message').deleteMany({ userId: this._id }, next)
})

userSchema.pre<IUser>('save', async function () {
	if (this.isModified('password')) {
		this.password = await this.generatePasswordHash()
	}
})

userSchema.methods.generatePasswordHash = async function () {
	const saltRounds = 10
	return await bcrypt.hash(this.password, saltRounds)
}

userSchema.methods.validatePassword = async function (password: string) {
	return await bcrypt.compare(password, this.password)
}

// DO NOT export
interface IUserSchema extends Document {
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	gender: string
	role: string
}

// DO NOT export | All the virtuals and instance methods have been attached
interface IUserBase extends IUserSchema {
	fullName: string
	generatePasswordHash(): Promise<string>
	validatePassword(): Promise<boolean>
}

// Export this for strong typing
export interface IUser extends IUserBase {}

const User = mongoose.model<IUser>('User', userSchema)

export default User
