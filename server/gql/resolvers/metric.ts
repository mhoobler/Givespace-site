import db from "../../db";
import { QueryResult } from "pg";
import { Context, Metric, MetricType } from "../../types";
import { notExist } from "../../utils/functions";

const metricResolvers = {
  Query: {
    getMetrics: async (
      _: null,
      args: { user_id: string; type: MetricType }
    ) => {
      let whereString: string = "";
      if (args.user_id || args.type) {
        whereString = "WHERE ";
        if (args.user_id) {
          whereString += `user_id = '${args.user_id}'`;
        }
        if (args.type) {
          if (args.user_id) {
            whereString += " AND ";
          }
          whereString += `type = '${args.type}'`;
        }
      }

      const metricsRes: QueryResult<Metric> = await db.query(
        `SELECT * FROM metrics ${whereString};`
      );
      return metricsRes.rows;
    },
  },
  Mutation: {
    createMetric: async (_: null, args: Metric, { authorization }: Context) => {
      const metric: Metric = {
        ...args,
        user_id: authorization,
      };
      const metricRes = await db.query(
        "INSERT INTO metrics (type, user_id, operation_name, operation_type, operation_variables, navigate_to, click_on) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          metric.type,
          metric.user_id,
          metric.operation_name,
          metric.operation_type,
          metric.operation_variables,
          metric.navigate_to,
          metric.click_on,
        ]
      );
      notExist("Metric", metricRes.rows[0]);
      return metricRes.rows[0];
    },
  },
  Subscription: {},
};

export default metricResolvers;
