Feature: Start page
  Example: Visitor is greeted
    Given I am on the home page
    When I look at it real close
    Then it says "welcome"

  @skip
  Example: Visitor is happy
    Given I am on zombo.com
    When I listen to its wisdom
    Then I am happy
