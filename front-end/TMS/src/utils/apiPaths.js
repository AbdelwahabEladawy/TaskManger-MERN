export const BASE_URL ='http://localhost:8000/api/v1';

export const API_PATHS = {
    // Auth
    AUTH: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
        PROFILE: `${BASE_URL}/auth/profile`,
        UPLOAD_IMAGE: `${BASE_URL}/auth/upload-image`,
    },

    // Users
    USERS: {
        GET_ALL: `${BASE_URL}/user`,
        GET_BY_ID: (id) => `${BASE_URL}/user/${id}`,
    },

    // Tasks
    TASKS: {
        GET_ALL: `${BASE_URL}/task`,
        GET_BY_ID: (id) => `${BASE_URL}/task/${id}`,
        CREATE: `${BASE_URL}/task`,
        UPDATE: (id) => `${BASE_URL}/task/${id}`,
        DELETE: (id) => `${BASE_URL}/task/${id}`,
        UPDATE_STATUS: (id) => `${BASE_URL}/task/${id}/status`,
        UPDATE_CHECKLIST: (id) => `${BASE_URL}/task/${id}/todo`,
        DASHBOARD_DATA: `${BASE_URL}/task/dashboard-data`,
        USER_DASHBOARD_DATA: `${BASE_URL}/task/user-dashboard-data`,
    },

    // Reports
    REPORTS: {
        EXPORT_TASKS: `${BASE_URL}/auth/export/tasks`,
        EXPORT_USERS: `${BASE_URL}/auth/export/users`,
    },


    IMAGE: {
        UPLOAD: `${BASE_URL}/auth/upload-image`,
    }
};

