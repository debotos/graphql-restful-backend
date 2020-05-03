import uuid from 'uuid/v4'

const message = (sequelize: any, DataTypes: any) => {
	const Message = sequelize.define('message', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		text: {
			type: DataTypes.STRING,
			validate: { notEmpty: { args: true, msg: "Message can't be empty." } },
		},
	})

	Message.beforeCreate(async (message: any) => {
		message.id = uuid()
	})

	return Message
}

export default message
