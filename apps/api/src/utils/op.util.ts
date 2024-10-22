

import _ from "lodash";
import { Collection } from "mongoose";

/**
 * @param {import("mongoose").Model} model Mongoose model
 * @param {any[]} ops op list
 */
async function applyOp(model: any, ops: any) {
  const operations = [];
  console.log(ops)

  for (const op of ops) {
    const { path, id } = op;
    const filter = { id };

    if (op.op === "insertRowCol") {
      
      const field = op.value.type === "row" ? "r" : "c";
      let insertPos = op.value.index;
      if (op.value.direction === "rightbottom") {
        insertPos += 1;
      }
      operations.push({
        updateOne: {
          filter,
          update: {
            $inc: {
              [`celldata.$[e].${field}`]: op.value.count,
            },
          },
          arrayFilters: [{ [`e.${field}`]: { $gte: insertPos } }],
        },
      });
    } else if (op.op === "deleteRowCol") {

      const field = op.value.type === "row" ? "r" : "c";
      operations.push(

        {
          updateOne: {
            filter,
            update: {
              $pull: {
                celldata: {
                  [field]: {
                    $gte: op.value.start,
                    $lte: op.value.end,
                  },
                },
              },
            },
          },
        },
       
        {
          updateOne: {
            filter,
            update: {
              $inc: {
                [`celldata.$[e].${field}`]: -(
                  op.value.end - op.value.start + 1
                ),
              },
            },
            arrayFilters: [{ [`e.${field}`]: { $gte: op.value.start } }],
          },
        }
      );
    } else if (op.op === "addSheet") {
      operations.push({ insertOne: { document: op.value } });
    } else if (op.op === "deleteSheet") {
      operations.push({ deleteOne: { filter } });
    } else if (
      
      path.length >= 3 &&
      path[0] === "data" &&
      _.isNumber(path[1]) &&
      _.isNumber(path[2])
    ) {
      // Cell update operation
      const key = ["celldata.$[e].v", ...path.slice(3)].join(".");
      const [, r, c] = path;
      const options = { arrayFilters: [{ "e.r": r, "e.c": c }] };
      const updater =
        op.op === "remove"
          ? {
              $unset: {
                [key]: "",
              },
            }
          : {
              $set: {
                [key]: op.value,
              },
            };

      if (path.length === 3) {
        const cellExists = await model.countDocuments({
          ...filter,
          celldata: {
            $elemMatch: {
              r,
              c,
            },
          },
        }); 

        if (cellExists) {
          operations.push({
            updateOne: { filter, update: updater, ...options },
          });
        } else {
          operations.push({
            updateOne: {
              filter,
              update: {
                $addToSet: {
                  celldata: {
                    r,
                    c,
                    v: op.value,
                  },
                },
              },
            },
          });
        }
      } else {
        operations.push({
          updateOne: { filter, update: updater, ...options },
        });
      }
    } else if (path.length === 2 && path[0] === "data" && _.isNumber(path[1])) {
      // Entire row operation
      console.error("row assigning not supported");
    } else if (path.length === 0 && op.op === "add") {
      // Add new sheet
      operations.push({ insertOne: { document: op.value } });
    } else if (path[0] !== "data") {
      // Other config update
      if (op.op === "remove") {
        operations.push({
          updateOne: {
            filter,
            update: {
              $unset: {
                [op.path.join(".")]: "",
              },
            },
          },
        });
      } else {
        operations.push({
          updateOne: {
            filter,
            update: {
              $set: {
                [op.path.join(".")]: op.value,
              },
            },
          },
        });
      }
    } else {
      console.error("unprocessable op", op);
    }
  }
  //@ts-ignore

  await model.bulkWrite(operations);
}

export default applyOp
