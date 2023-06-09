import React, { Fragment, useEffect, useState } from "react";
import SweetAlert from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import {
  change_user_status,
  fetch_users,
  reset_password,
} from "../../../redux/actions/user";
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

const moment = require("moment");

const UserTable = () => {
  const dispatch = useDispatch();

  const [ isOpen, setIsOpen ] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  // const [popover, setPopover] = useState(false);
  // const Toggle = () => setPopover(!popover);

  useEffect(() => {
    dispatch(fetch_users());
  }, []);

  const { users } = useSelector((state) => state.user);

  const displayAlert = (user, type) => {
    SweetAlert.fire({
      title: "Are you sure?",
      icon: "question",
      cancelButtonText: "No",
      confirmButtonText: "I'm sure!",
      reverseButtons: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        type === "resetPassword"
          ? dispatch(reset_password(user._id, user.name))
          : dispatch(change_user_status(user._id));
      }
    });
  };

  let data = [];

  users.map((user, index) => {
    return data.push({
      index: index+1,
      name: user.name,
      email: user.email,
      status: (
        <span
          className={`badge badge-light-${user.allowed ? "primary" : "danger"}`}
        >
          {user.allowed ? "Allowed" : "Blocked"}
        </span>
      ),
      register_date: moment(user.date).format("yyyy.MM.DD hh:mm:ss A"),
      action: (
        <Button color="info" onClick={() => displayAlert(user, "changeStatus")}>
          {user.allowed ? "Block" : "Allow"}
        </Button>
      ),
      profile: (
        <Button
          color="link"
          onClick={toggle}
        >
          View Profile
        </Button>
      ),
    });
  });

  const tableColumns = [
    {
      name: "No",
      selector: (row) => row.index,
      sortable: false,
      center: false,
      width: "5%",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      center: false,
      width: "15%",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      center: false,
      width: "25%",
    },
    {
      name: "Status",
      selector: (row) => row["status"],
      sortable: true,
      center: false,
      width: "10%",
    },
    {
      name: "Register Date",
      selector: (row) => row.register_date,
      sortable: true,
      center: false,
      width: "20%",
    },
    {
      name: "Action",
      selector: (row) => row["action"],
      sortable: false,
      center: false,
      width: "15%",
    },
    {
      name: "View Profile",
      selector: (row) => row["profile"],
      sortable: false,
      center: false,
      width: "10%",
    },
  ];

  return (
    <Fragment>
      <Offcanvas toggle={toggle} isOpen={isOpen} keyboard={true}>
        <OffcanvasHeader toggle={toggle}>
          Offcanvas
        </OffcanvasHeader>
        <OffcanvasBody>
          <strong>
            This is the Offcanvas body.
          </strong>
        </OffcanvasBody>
      </Offcanvas>
      <DataTable
        data={data}
        columns={tableColumns}
        striped={true}
        center={false}
        responsive={true}
        pagination
      />
    </Fragment>
  );
};
export default UserTable;
