export const batchUsers = async (keys: any, MongoDB: any) => {
	const users = await MongoDB.User.find({ _id: { $in: keys } })

	return keys.map((key: string) => users.find((user: any) => user.id == key))
}
