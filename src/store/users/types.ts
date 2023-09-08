/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { Role } from "../roles/types";

export interface UsersState {
	/** List of the connected user */
	connectedUsers: ConnectedUser[];
	currentUser: CurrentUser | null;
	listUsers: ListUser[];
	filteredUsers: ListUser[];
	activeUsersFilter: boolean | undefined;
	blockedUsersFilter: boolean | undefined;
	usersFilter: any | undefined;
}

export interface ConnectedUser {
	/** User unique identifier */
	userId: number;
	/** User login */
	login: string;
	/** Timestamp issued when the user logged in successfully */
	timestamp: string;
	/** User's connection duration */
	connectionDuration?: string;
}

export interface CurrentUser {
	/** User unique identifier */
	id: number;
	/** User login */
	login: string;
	/** User name */
	name: string;
	/** User firstName */
	firstName: string;
	/** User email */
	email: string;
	/** User active status */
	active?: boolean;
	/** User blocked status*/
	blocked?: boolean;
	/** User blocked reason */
	blockingReason?: string;
}

export interface ListUser {
	/** User unique identifier */
	id: number;
	/** User login */
	login: string;
	/** User name */
	name: string;
	/** User firstName */
	firstName: string;
	/** User email */
	email?: string;
	/** User active status */
	active?: boolean;
	/** User blocked status*/
	blocked?: boolean;
	/** User blocked reason */
	blockingReason?: string;

	/** User roles */
	roles?: Role[];
}

export interface UserToCreate {
	/** The user unique login */
	login: string;
	/** The user password */
	password?: string;
	/** The user lastname */
	name: string;
	/** The user firstname */
	firstName: string;
	/** The user email address */
	email: string;
}
