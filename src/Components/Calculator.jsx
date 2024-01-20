import moment from "moment";
import { useEffect, useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import Alert from "./Alert";
import ArrowSVG from "./ArrowSvg";
import CountUp from 'react-countup';

const Calculator = () => {
  const [dayInput, setDayInput] = useState();
  const [monthInput, setMonthInput] = useState();
  const [yearInput, setYearInput] = useState();

  const [showDay, setShowDay] = useState("---");
  const [showMonth, setShowMonth] = useState("---");
  const [showYear, setShowYear] = useState("---");

  const [alert, setAlert] = useState({ text: "" });

  const currentDate = moment();

  const calculate = (e) => {
    e.preventDefault();

    /* Correction days and months input */
    setDayInput(prevDayInput => {
      const paddedDayInput = prevDayInput.padStart(2, '0');
      setDayInput(paddedDayInput); // Actualizar el estado
      return paddedDayInput;
    });
    
    setMonthInput(prevMonthInput => {
      const paddedMonthInput = prevMonthInput.padStart(2, '0');
      setMonthInput(paddedMonthInput); // Actualizar el estado
      return paddedMonthInput;
    });
    
    /* DAYS */
    const daysDiff = currentDate.format('DD') - dayInput;
    const lastDayofMonth = currentDate.endOf('month');
    if(daysDiff < 0){
      const days = daysDiff / -1 
      setShowDay(lastDayofMonth.format('DD') - days);
    }else if(dayInput < currentDate.format('DD')){
      setShowDay(daysDiff)
    }else{
      setShowDay(lastDayofMonth.format('DD') - daysDiff);
    }

    /* MONTHS */
    const monthsDec = currentDate.format('MM') - 1;
    const monthsDiff = 12 - monthInput; 
    const monthsPlus = monthsDiff + monthsDec;
    if(currentDate.format('MM') <= monthInput - 1 && currentDate.format('DD') < dayInput){
      setShowMonth(monthsDiff)
    }else if(dayInput < currentDate.format('DD') && monthInput !== currentDate.format('MM')){
      setShowMonth(monthsDiff + 1)
    }else if(monthInput === currentDate.format('MM')){
      setShowMonth(0)
    }else{
      setShowMonth(monthsPlus)
    }

    /* YEARS */
    const years = currentDate.format('YYYY') - yearInput;
    const yearsDiff = years - 1;
    if(monthInput === currentDate.format('MM') && dayInput <= currentDate.format('DD')){
      setShowYear(years)
    }else{
      setShowYear(yearsDiff)
    }
  };

  useEffect(() => {
    if (!dayInput || !monthInput || !yearInput) {
      setAlert({ text: "(*) All the fields must be completed" });
    } else if (dayInput > 31 || dayInput < 1) {
      setAlert({ text: "The day field must be a number between 1 and 31." });
    } else if (monthInput > 12 || monthInput < 1) {
      setAlert({ text: "The month field must be a number between 1 and 12." });
    } else if (isNaN(showDay) && isNaN(showMonth) && isNaN(showYear)) {
      setAlert({
        text: "Amount of days must correspond to the month indicated.",
      });
    } else {
      setAlert({ text: "" });
    }
  }, [dayInput, monthInput, yearInput, showDay, showMonth, showYear]);

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card style={{ width: '50rem' }}>
        <Card.Body>
          <div className="row">
            <div className="col-4">
              <Form.Label>Day*</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setDayInput(e.target.value) }
              />
            </div>
            <div className="col-4">
              <Form.Label>Month*</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMonthInput(e.target.value)}
              />
            </div>
            <div className="col-4">
              <Form.Label>Year*</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setYearInput(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <Button onClick={calculate}><ArrowSVG /></Button>

          <Container className="result-container">
            <p>
              {isNaN(showYear) ? "---" : <><span><CountUp end={showYear} duration={5} /></span> {showYear === 1 ? "year" : "years"} </>}
            </p>
            <p>
              {isNaN(showMonth) ? "---" : <><span><CountUp end={Math.round(showMonth)} duration={5} /></span> {showMonth === 1 ? "month" : "months"}</>}
            </p>
            <p>
              {isNaN(showDay) ? "---" : <><span><CountUp end={Math.round(showDay)} duration={5} /></span> {showDay === 1 ? "day" : "days"} </>}
            </p>
          </Container>
        </Card.Body>

        <Card.Footer className="card-footer"><Alert text={alert.text} /></Card.Footer>
        
      </Card>
    </Container>
  );
};

export default Calculator;
