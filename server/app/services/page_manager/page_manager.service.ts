import { Page } from "@app/interface/page";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
@Injectable()
export class PageManagerService {
  pages: Map<string, Page> = new Map();

  next(
    id: string,
    isNext: boolean
  ): { isNext: boolean; isPrevious: boolean; page: any[]} | null {
    const page = this.pages.get(id);
    if (!this.isAcceptable(page, isNext)) {
      return null;
    }
    page.state = isNext ? page.state + page.limits : page.state - page.limits;
    return {
      isNext: page.state + page.limits <= page.items.length,
      isPrevious: page.state - page.limits >= 0,
      page: page.items.slice(page.state, page.state + page.limits),
    };
  }

  insert(limits: number, state: number, items: any[]) {
    const id = uuidv4();
    const page = {
      items,
      state,
      limits,
    };
    this.pages.set(id, page);
    return {
      id,
      page: page.items.slice(page.state, page.state + page.limits), 
      isNext: page.state + page.limits < page.items.length,
      isPrevious: page.state - page.limits > 0,
    };
  }

  page(id: string) {
    return this.pages.get(id);
  }

  private isAcceptable(page: Page, isNext: boolean) {
    
    return !page? false : (
      ((isNext && page.state + page.limits <= page.items.length) ||
      (!isNext && page.state - page.limits >= 0))
    );
  }
}
