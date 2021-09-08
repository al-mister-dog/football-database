import MainNav from "../../src/components/navs/MainNav.vue";
import LeaguesToTeamsNav from "../../src/components/navs/LeaguesToTeamsNav.vue";
import LeagueTablesNav from "../../src/components/navs/LeagueTablesNav.vue";
import StatsNav from "../../src/components/navs/StatsNav";
import TeamsNav from '../../src/components/navs/TeamsNav';

import "@testing-library/jest-dom";
import { render } from "@testing-library/vue";
import { mount } from "@vue/test-utils";
import { setupServer } from "msw/node";
import { rest } from "msw";
import "whatWg-fetch";

describe("MainNav", () => {
  describe("MainNav Contents", () => {
    it("has a logo", () => {
      const { getByText } = render(MainNav);
      const logo = getByText("Footy Base");
      expect(logo).toBeInTheDocument();
    });

    it.each`
      btnName
      ${"Players"}
      ${"Leagues"}
      ${"Teams"}
      ${"Stats"}
    `("has a $btnName button", ({ btnName }) => {
      const { getByText } = render(MainNav);
      const button = getByText(btnName);
      expect(button).toBeInTheDocument();
    });
  });

  describe("Events", () => {
    it("emits the event 'select-players' when clicking onSelectPlayers", () => {
      const wrapper = mount(MainNav);
      wrapper.vm.onSelectPlayers();
      expect(Object.keys(wrapper.emitted())).toEqual(["select-players"]);
    });

    it("emits the event 'set-selected-sub-nav' when clicking setSelectedSubNav", () => {
      const wrapper = mount(MainNav);
      wrapper.vm.setSelectedSubNav();
      expect(Object.keys(wrapper.emitted())).toEqual(["set-selected-sub-nav"]);
    });

    it.each`
      eventValue
      ${"leagues-to-teams-nav"}
      ${"league-tables-nav"}
      ${"stats-nav"}
    `(
      "contains $eventValue when clicking setSelectedSubNav",
      ({ eventValue }) => {
        const wrapper = mount(MainNav);
        wrapper.vm.setSelectedSubNav(eventValue);
        const results = wrapper.emitted();
        expect(Object.values(results)[0][0]).toEqual([eventValue]);
      }
    );
  });
});

describe("LeaguesToTeamsNav", () => {
  describe("LeaguesToTeamsNav Contents", () => {
    it.each`
      btnName
      ${"Premier League"}
      ${"Ligue 1"}
      ${"La Liga"}
      ${"Bundesliga"}
      ${"Serie A"}
    `("has a $btnName button", ({ btnName }) => {
      const { getByText } = render(LeaguesToTeamsNav);
      const button = getByText(btnName);
      expect(button).toBeInTheDocument();
    });
  });

  describe("Events", () => {
    it("emits the event 'select-players' when clicking onSelectPlayers", () => {
      const wrapper = mount(MainNav);
      wrapper.vm.onSelectPlayers();
      expect(Object.keys(wrapper.emitted())).toEqual(["select-players"]);
    });

    it("emits the event 'set-selected-sub-nav' when clicking setSelectedSubNav", () => {
      const wrapper = mount(MainNav);
      wrapper.vm.setSelectedSubNav();
      expect(Object.keys(wrapper.emitted())).toEqual(["set-selected-sub-nav"]);
    });

    it.each`
      eventValue
      ${"leagues-to-teams-nav"}
      ${"league-tables-nav"}
      ${"stats-nav"}
    `(
      "contains $eventValue when clicking setSelectedSubNav",
      ({ eventValue }) => {
        const wrapper = mount(MainNav);
        wrapper.vm.setSelectedSubNav(eventValue);
        const results = wrapper.emitted();
        expect(Object.values(results)[0][0]).toEqual([eventValue]);
      }
    );
  });
});

describe("LeagueTablesNav", () => {
  it.each`
    btnName
    ${"Premier League"}
    ${"La Liga"}
  `("has a $btnName button", ({ btnName }) => {
    const { getByText } = render(LeagueTablesNav);
    const button = getByText(btnName);
    expect(button).toBeInTheDocument();
  });

  it("contains a string value when clicking onSelectLeague", () => {
    const wrapper = mount(LeagueTablesNav);
    wrapper.vm.onSelectLeague("premier-league");
    const result = wrapper.emitted();
    expect(Object.values(result)[0][0]).toEqual(["premier-league"]);
  });
});

describe("Stats Nav", () => {
  it.each`
    btnName
    ${"Team Age"}
    ${"Average Age"}
    ${"Combined Market Value"}
    ${"Home Grown Players"}
    ${"Most Defenders"}
    ${"Most Forwards"}
  `("has a $btnName button", ({ btnName }) => {
    const { getByText } = render(StatsNav);
    const button = getByText(btnName);
    expect(button).toBeInTheDocument();
  });
  it("emits an event and a stat", async () => {
    const wrapper = mount(StatsNav);
    wrapper.vm.onSelectStat("stat");
    const results = wrapper.emitted();
    expect(results).toEqual({ "select-stats": [["stat"]] });
  });
});

describe('Teams Nav', () => {
  it('sends a fetch request with a params id on getTeam method', async () => {
    let paramsId;
    const server = setupServer(
      rest.get("http://localhost:4000/get-team/:id", (req, res, ctx) => {
        paramsId = req.params.id;
        return res(ctx.status(200));
      })
    )
    server.listen();
    const wrapper = mount(TeamsNav);
    wrapper.vm.onClickTeamLogo(1);
    await server.close();
    expect(paramsId).toBe("1")
  })
  it('sends a fetch request with a params id when onClickTeamLogo is called', async () => {
    let paramsId;
    const server = setupServer(
      rest.get("http://localhost:4000/get-team/:id", (req, res, ctx) => {
        paramsId = req.params.id;
        return res(ctx.status(200));
      })
    )
    server.listen();
    const wrapper = mount(TeamsNav);
    wrapper.vm.onClickTeamLogo(1);
    await server.close();
    expect(paramsId).toBe("1")
  })
  it('emits an event and id when sendTeamDetails is called', async () => {
    const wrapper = mount(TeamsNav);
    wrapper.vm.sendTeamDetails(1);
    const results = wrapper.emitted();
    expect(results).toEqual({ "select-team": [[1]] })
  })
})

