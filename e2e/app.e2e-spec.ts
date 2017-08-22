import { ExpPagesPage } from './app.po';

describe('exp-pages App', () => {
  let page: ExpPagesPage;

  beforeEach(() => {
    page = new ExpPagesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
