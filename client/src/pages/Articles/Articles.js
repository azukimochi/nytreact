import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";

class Articles extends Component {
  state = {
    articles: [],
    title: "",
    date: "",
    url: "",
    searchTitle: "",
    searchStartYr:"",
    searchEndYr:""
  };

  componentDidMount() {
    this.loadArticles();
  }

  goToURL = url => {
    window.open(url, "_blank")
  }

  loadArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ articles: res.data, title: "", date: "", url: "" })
      )
      .catch(err => console.log(err));
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.searchTitle && this.state.searchStartYr && this.state.searchEndYr) {
      API.saveArticle({
        title: this.state.title,
        author: this.state.author,
        synopsis: this.state.synopsis
      })
        .then(res => this.loadArticles())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Article Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.searchTitle}
                onChange={this.handleInputChange}
                name="search-title"
                placeholder="Topic (required)"
              />
              <Input
                value={this.state.searchStartYr}
                onChange={this.handleInputChange}
                name="search-start-yr"
                placeholder="Start Year (required)"
              />
              <TextArea
                value={this.state.searchEndYr}
                onChange={this.handleInputChange}
                name="synopsis"
                placeholder="End Year (Optional)"
              />
              <FormBtn
                disabled={!(this.state.author && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Search
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Articles On My List</h1>
            </Jumbotron>
            {this.state.articles.length ? (
              <List>
                {this.state.articles.map(article => (
                  <ListItem key={article._id}>
                    {/* <Link to={"/articles/" + article._id}> */}
                    {/* <Link to={article.url}> */}
                      <strong onClick = {() => this.goToURL(article.url)}>
                        {article.title}
                      </strong>
                      <strong>
                        {article.date}
                        </strong>
                    {/* </Link> */}
                    <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
