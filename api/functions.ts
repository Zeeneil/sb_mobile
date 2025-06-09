import { functions } from "../firebase/firebase";
import { httpsCallable } from "firebase/functions";

// Call getAllUsers Cloud Function
export const dogetAllUsers = async (
  page: number = 1, 
  limit: number = 10
): Promise<{
  users: any[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  activeTeachersCount: number;
  activeStudentsCount: number;
  activeAdminsCount: number;
}> => {
  try {
    const getAllUsers = httpsCallable(functions, "getAllUsers");
    const response = await getAllUsers({ page, limit });
    return response.data as {
      users: any[];
      totalUsers: number;
      currentPage: number;
      totalPages: number;
      activeTeachersCount: number;
      activeStudentsCount: number;
      activeAdminsCount: number;
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const doCreateUser = async (signInUser: string, displayName: string, email: string, password: string, role: string) => {
  try {
    const createUser = httpsCallable(functions, "createUser");
    const response = await createUser({ signInUser, displayName, email, password, role });
    return response.data;
  }
  catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Call setUserRole Cloud Function
export const doSetUserRole = async (uid: string, role: string) => {
  try {
    const setUserRole = httpsCallable(functions, "setUserRole");
    await setUserRole({ uid, role });
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
};

export const doSetUserStatus = async (signInUser: string, uid: string, status: boolean) => {
  try {
    const setUserStatus = httpsCallable(functions, "setUserStatus");
    await setUserStatus({ signInUser, uid, status });
  } catch (error) {
    console.error("Error setting user status:", error);
    throw error;
  }
}

export const doUpdateUser = async (uid: string, displayName: string, email: string, password: string, role: string) => {
  try {
    const setUpdateUser = httpsCallable(functions, "setUpdateUser");
    const response = await setUpdateUser({ uid, displayName, email, password, role });
    return response.data;
  }
  catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Call deleteUser Cloud Function
export const deleteUser = async (uid: string[]) => {
  try {
    const deleteUserFn = httpsCallable(functions, "deleteUser");
    const response = await deleteUserFn({ uids: uid });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Call getAdminStats Cloud Function
export const getAdminStats = async () => {
  try {
    const getAdminStatsFn = httpsCallable(functions, "getAdminStats");
    const response = await getAdminStatsFn();
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};