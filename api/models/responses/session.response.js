class SessionResponse {
    constructor(session, previousSelectionCompleted) {
        this.start_at = session.start_at;
        this.end_at = session.end_at;
        this.in_progress = session.start_at <= new Date() && session.end_at >= new Date();
        this.previous_selection_completed = previousSelectionCompleted;
    }
}

module.exports = SessionResponse;
