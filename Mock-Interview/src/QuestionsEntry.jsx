function QuestionsEntry(){
    return(
        <div class="container mt-5">
            <div class="card-shadow">
                <div class="card-header text-black">
                    <h4>Submit Interview Question</h4>
                </div>
                <div class="card-body">
                    <form id="questionForm">
                        <div class="mb-3">
                            <label for="question" class="form-label">
                                Interview Question
                            </label>
                            <textarea name="question" id="question" rows="4" class="form-control" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit Question</button>
                    </form>
                    <div id="alert" class="alert mt-3 d-none"></div>
                </div>
            </div>
        </div>
    )

}

export default QuestionsEntry