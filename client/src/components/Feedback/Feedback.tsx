import React, { useState } from "react";
import { Modal } from "..";
import useUtilsHooks from "../../graphql/hooks/utils";

const Feedback: React.FC = () => {
  const [show, setShow] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addFeedback, addClickMetric } = useUtilsHooks();
  // retrieve the text from messageRef

  const onFeedbackClick = () => {
    setShow(true);
    addClickMetric("feedback button");
  };

  const onSubmit = () => {
    setMessage("");
    setSubmitted(true);
    addFeedback(message, followUp ? email || null : null);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setSubmitted(false);
    }, 100);
  };

  return (
    <div>
      <Modal show={show} close={handleClose}>
        {submitted ? (
          <Modal.Header>
            <h3>Feedback submitted. Thanks for your input!</h3>
          </Modal.Header>
        ) : (
          <>
            <Modal.Header>
              <h3>Feedback</h3>
            </Modal.Header>
            <Modal.Body>
              <label htmlFor="feedback">Any thoughts to share?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                id="feedback"
                rows={3}
                placeholder="Send feedback..."
              />
              <input
                id="feeback-checkbox"
                type="checkbox"
                checked={followUp}
                onChange={(e) => setFollowUp(e.target.checked)}
              />
              <label htmlFor="feeback-checkbox">
                May we follow up with you?
              </label>
              {followUp && (
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    placeholder="Enter email"
                  />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={onSubmit}>Submit</button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      <button onClick={onFeedbackClick}>Feedback</button>
    </div>
  );
};

export default Feedback;
