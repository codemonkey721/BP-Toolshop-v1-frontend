import React, { Fragment } from "react"
import { Container, Row, Col } from 'reactstrap';
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Fragment>
      <Container fluid={true} className='p-0 login-page'>
        <Row>
          <Col xs='12'>
            <div className='login-card'>
              <div className='login-main login-tab'>
                <ResetPasswordForm />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default ResetPassword
