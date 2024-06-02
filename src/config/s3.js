module.exports = {
    path: {
        userPhoto: "user/photo/{userId}",
        userIdProof: "user/idProof/{userId}",
        userCertificate: "user/certificate/{userId}",
        course: "course/image/{courseId}",
        moduleDocument: "subject/recordedSessions/document/{subjectId}",
        liveClass: "liveClass/image/{liveId}",
        default: "default",
    },
    acl: {
        private: "private",
        publicRead: "public-read",
    },
    presignedUrlExpiresIn: 60 * 5, // seconds
};
