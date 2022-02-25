import React, { useState } from "react";
import { Modal } from "..";
import useUtilsHooks from "../../graphql/hooks/utils";

const Feedback: React.FC = () => {
  const [show, setShow] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const { addFeedback, addClickMetric } = useUtilsHooks();
  // retrieve the text from messageRef

  const onFeedbackClick = () => {
    setShow(true);
    addClickMetric("feedback button");
  };

  const onSubmit = () => {
    addFeedback(message, email || null);
  };

  return (
    <div>
      <Modal show={show} close={() => setShow(false)}>
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
            onChange={(e) => setFollowUp(e.target.checked)}
          />
          <label htmlFor="feeback-checkbox">May we follow up with you?</label>
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
      </Modal>
      <button onClick={onFeedbackClick}>Feedback</button>
    </div>
  );
};

export default Feedback;
