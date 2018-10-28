import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import Home from "../../components/Home";
import Header from "../../components/Header";
import Heading from "../../components/Heading";
import Saved from "../../components/Saved";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";
import axios from "axios";
const apiURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const apiKey = 'b9f91d369ff59547cd47b931d8cbc56b:0:74623931';

class Articles extends Component {
  state = {
    savedArticles: [],
    scrapedArticles: [],
    searchTitle: "",
    searchStartYr: "",
    searchEndYr: ""

  };

  componentDidMount() {
    this.getSavedArticles();
  }

  goToURL = url => {
    window.open(url, "_blank")
  }

  getSavedArticles = updatedResults => {
    API.getArticles()
      .then(res => {
        console.log(res)
        this.setState({
          savedArticles: res.data,
          scrapedArticles: updatedResults || []
        })
      })
      .catch(err => console.log(err));
  };

  getScrapedArticles = res => {
    this.setState({
      scrapedArticles: res.data.response.docs,
      searchTitle: "",
      searchStartYr: "",
      searchEndYr: ""
    })
    console.log(this.state.scrapedArticles)
  }

  saveArticle = (data) => {
    API.saveArticle({
      title: data.headline.main,
      date: data.pub_date,
      url: data.web_url
    })
      .then(res => {
        const updatedResults = this.state.scrapedArticles.filter(article => article._id !== data._id)
        this.getSavedArticles(updatedResults)
      })
      .catch(err => console.log(err))
  }

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.getSavedArticles())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    console.log({ name, value })
    this.setState({
      [name]: value
    });
  };

  scrapeArticlesFunction = () => {
    if (this.state.searchTitle && this.state.searchStartYr && this.state.searchEndYr) {
      console.log("This is the topic: " + this.state.searchTitle);
      console.log("This is the start year: " + this.state.searchStartYr);
      console.log("This is the end year: " + this.state.searchEndYr);
      axios.get(`${apiURL}?q=${this.state.searchTitle}?begin_date=${this.state.searchStartYr}?end_date=${this.state.searchEndYr}&api-key=${apiKey}`)
        .then(res => {
          console.log("Axios http call worked!");
          this.getScrapedArticles(res)
        })
        .catch(err => console.log(err));
    }
  }
  handleFormSubmit = event => {
    event.preventDefault();
    const startYrLength = this.state.searchStartYr.length
    const endYrLength = this.state.searchEndYr.length
    if (startYrLength == 4 && endYrLength == 4) {
      console.log("All parametres met!")
      this.scrapeArticlesFunction()
    } else {
      console.log("Need to reconfigure!")
    }


  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Header>
              Search
            </Header>
      <Home>
            <form>
              <Heading>Topic (required)</Heading>
              <Input
                value={this.state.searchTitle}
                onChange={this.handleInputChange}
                name="searchTitle"
              />
              <Heading>Start Year (required)</Heading>
              <Input
                value={this.state.searchStartYr}
                onChange={this.handleInputChange}
                name="searchStartYr"
              />
              <Heading>Ending Year (required)</Heading>
              <Input
                value={this.state.searchEndYr}
                onChange={this.handleInputChange}
                name="searchEndYr"
              />
              <FormBtn disabled={!(this.state.searchStartYr && this.state.searchEndYr)}
                onClick={this.handleFormSubmit}>
                Search
                </FormBtn>
            </form>
            </Home>
          </Col>

          <Col size="md-12 sm-12">
            <Header>
              Results
            </Header>
          <Home>
            {this.state.scrapedArticles.length ? (
              <List>
                {this.state.scrapedArticles.map(article => (
                  <ListItem key={article._id}>
                    <p>
                      <strong onClick={() => this.goToURL(article.web_url)}>
                        {article.headline.main}
                      </strong>
                      <SaveBtn onClick={() => this.saveArticle(article)} />
                    </p>
                    <p>
                      Published Date: {article.pub_date.slice(0, 10)}
                    </p>
                  </ListItem>
                ))}

              </List>
            ) : (
                <Heading>No Results to Display</Heading>
              )}
            </Home>
          </Col>

          <Col size="md-12 sm-12">
            <Header>
              Saved Articles
            </Header>
          <Saved>
            {this.state.savedArticles.length ? (
              <List>
                {this.state.savedArticles.map(article => (
                  <ListItem key={article._id}>
                    {/* <Link to={"/articles/" + article._id}> */}
                    {/* <Link to={article.url}> */}
                    <p>
                      <strong onClick={() => this.goToURL(article.url)}>
                        {article.title}
                      </strong>
                      <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
                    </p>
                    <p>
                      Published Date: {article.date.slice(0, 10)}
                    </p>
                  </ListItem>
                ))}
              </List>
            ) : (
                <Heading>No Results to Display</Heading>
              )}
              </Saved>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
