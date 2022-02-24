import db from "../../db";
import { QueryResult } from "pg";
import { Metric, MetricType } from "../../types";

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
  Mutation: {},
  Subscription: {},
};

export default metricResolvers;
