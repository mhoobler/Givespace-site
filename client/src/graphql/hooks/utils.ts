import { useMutation } from "@apollo/client";
import { CREATE_FEEDBACK, CREATE_METRIC } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

const UtilsHooks: UtilsHook.FC = () => {
  const [createMetricMutation, { error: creteMetricError }] =
    useMutation(CREATE_METRIC);
  apolloHookErrorHandler("creteMetricError", creteMetricError);
  const addNavigationMetric = (navigate_to: string) => {
    createMetricMutation({
      fetchPolicy: "no-cache",
      variables: {
        type: "routing",
        navigate_to,
      },
    });
  };
  const addClickMetric = (click_on: string) => {
    createMetricMutation({
      fetchPolicy: "no-cache",
      variables: {
        type: "click",
        click_on,
      },
    });
  };

  const [createFeedbackMutation, { error: creteFeedbackError }] =
    useMutation(CREATE_FEEDBACK);
  apolloHookErrorHandler("creteFeedbackError", creteFeedbackError);
  const addFeedback = (message: string, email: string | null) => {
    createFeedbackMutation({
      fetchPolicy: "no-cache",
      variables: {
        message,
        email,
      },
    });
  };

  return {
    addNavigationMetric,
    addClickMetric,
    addFeedback,
  };
};

export default UtilsHooks;
