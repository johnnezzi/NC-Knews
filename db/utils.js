const timeConverter = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
  return time;
};

exports.formatArticles = articlesData => articlesData.map(({ created_by, created_at, ...restOfArticle }) => ({
  username: created_by,
  created_at: timeConverter(created_at),
  ...restOfArticle,
}));

exports.formatComments = (comments, articles) => comments.map(({
  created_by, belongs_to, created_at, ...restOfComments
}) => {
  const art = articles.find(el => el.title === belongs_to);
  return {
    username: created_by,
    article_id: art.article_id,
    created_at: timeConverter(created_at),
    ...restOfComments,
  };
});

