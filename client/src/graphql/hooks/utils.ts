import { useMutation } from "@apollo/client";
import { CREATE_METRIC } from "../../graphql/schemas";
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

  return {
    addNavigationMetric,
    addClickMetric,
  };
};

export default UtilsHooks;
