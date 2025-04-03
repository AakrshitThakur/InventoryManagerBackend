// Requests routes
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication.js");
const CheckAuthorizationForReqs = require("../middlewares/CheckAuthorizationForReqs.js");
const UserClass = require("../models/User.js");
const ReqClass = require("../models/Request.js");

// Function to delete reqs older than a given duration
async function DeleteOldReqs() {
  const ExpirationTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const ReqsDeleted = await ReqClass.deleteMany({
    CreatedAt: { $lt: ExpirationTime },
  });
  console.log(`Deleted ${ReqsDeleted.deletedCount} old requests.`);
}

// Sending total received requests
router.get("/reqs/ViewReqsReceived", CheckAuthentication, async (req, res) => {
  console.log("Under /reqs/ViewReqsReceived route");
  try {
    // Deleting all the expired reqs
    DeleteOldReqs();

    const ReqsReceived = await ReqClass.find({
      receiver: req.session.user.id,
    }).sort({ _id: -1 });

    // Excluding all IDs in the array of objects
    const FilteredReqsReceived = await Promise.all(
      ReqsReceived.map(async (req, idx) => {
        const sender = await UserClass.findOne({ _id: req.sender });
        return {
          idx,
          id: req._id,
          quantity: req.quantity,
          msg: req.msg,
          ItemImgURL: req.ItemImgURL,
          status: req.status,
          response: req.response,
          ExpiryDate: (new Date() - req.CreationDate).toLocaleString(),
          SenderName: sender.username,
        };
      })
    );
    console.log(FilteredReqsReceived);
    return res.json({
      ReqsReceived: FilteredReqsReceived,
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.statusCode,
      },
    });
  }
});

// Sending total requests sent by the user
router.get("/reqs/ViewSentreqs", CheckAuthentication, async (req, res) => {
  console.log("Under /reqs/ViewSentreqs route");
  try {
    // Deleting all the expired reqs
    DeleteOldReqs();

    const SentReqs = await ReqClass.find({
      sender: req.session.user.id,
    }).sort({ _id: -1 });

    // Excluding all IDs in the array of objects
    const FilteredReqsReceived = await Promise.all(
      SentReqs.map(async (req, idx) => {
        const receiver = await UserClass.findOne({ _id: req.receiver });
        return {
          idx,
          id: req._id,
          quantity: req.quantity,
          msg: req.msg,
          ItemImgURL: req.ItemImgURL,
          status: req.status,
          response: req.response,
          ExpiryDate: new Date(
            new Date(req.CreationDate).getTime() + 7 * 24 * 60 * 60 * 1000
          ).toLocaleString(),
          ReceiverName: receiver.username,
        };
      })
    );
    return res.json({
      ReqsReceived: FilteredReqsReceived,
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      GeneralError: {
        msg: error.message,
        StatusCode: error.statusCode,
      },
    });
  }
});

// Req accepted
router.get(
  "/reqs/:id/accept",
  CheckAuthentication,
  CheckAuthorizationForReqs,
  async (req, res) => {
    console.log("Under /reqs/accept route");
    try {
      const { id } = req.params;
      const request = await ReqClass.findById(id);

      if (request.status == "init") {
        request.status = "accepted";
        console.log(await request.save());
        return res.json({
          SuccessMsg: "Request successfully accepted",
        });
      }
      throw new Error("You aren't allowed to accept the request");
    } catch (error) {
      console.error(error.message);
      res.json({
        GeneralError: {
          msg: error.message,
          StatusCode: error.statusCode,
        },
      });
    }
  }
);

// Req rejected
router.get(
  "/reqs/:id/reject",
  CheckAuthentication,
  CheckAuthorizationForReqs,
  async (req, res) => {
    console.log("Under /reqs/accept route");
    try {
      const { id } = req.params;
      const request = await ReqClass.findById(id);

      if (request.status == "init") {
        request.status = "rejected";
        console.log(await request.save());
        return res.json({
          SuccessMsg: "Request successfully rejected",
        });
      }
      throw new Error("You aren't allowed to reject the request");
    } catch (error) {
      console.error(error.message);
      res.json({
        GeneralError: {
          msg: error.message,
          StatusCode: error.statusCode,
        },
      });
    }
  }
);

// Edit a response
router.post(
  "/reqs/:id/EditResponse",
  CheckAuthentication,
  CheckAuthorizationForReqs,
  async (req, res) => {
    console.log("Under /reqs/:id/EditResponse route");
    try {
      const { id } = req.params;
      const { ResponseMsg } = req.body;
      const request = await ReqClass.findById(id);

      if (request.status == "init") {
        request.response = ResponseMsg;
        console.log(await request.save());
        return res.json({
          SuccessMsg: "Response sent successfully",
        });
      }
      throw new Error("You aren't allowed to edit the response of request");
    } catch (error) {
      console.error(error.message);
      res.json({
        GeneralError: {
          msg: error.message,
          StatusCode: error.statusCode,
        },
      });
    }
  }
);

module.exports = router;
