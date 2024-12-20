"use client"

import { getTceUser, getUser } from "@/api"
import { TceUser } from "@/types"
import { useState } from "react"

export const ValidaUser = async (relatorio: string) => {
	//const userName = await getUser()
	const [userName, setUserName] = useState("")
	setUserName(await getUser())

	let tceUser = null

	if (userName) {
		const data = await getTceUser({'USER': `REALCAFE\\${userName}`, 'RELATORIO':relatorio})
		tceUser = data? data : {} as TceUser
	}
	//const isLoading = userDataLoading || tceUserLoading

	return {tceUser,userName}
}
