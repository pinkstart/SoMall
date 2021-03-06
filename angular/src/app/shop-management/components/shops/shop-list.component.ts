import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ShopProxyService, ShopDto } from 'src/api/appService';
import { ShopEditComponent } from '../shop-edit/shop-edit.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './shop-list.component.html'
})
export class ShopListComponent implements OnInit {

  dataItems: any[] = [];
  pageingInfo = {
    totalItems: 0,
    pageNumber: 0,
    pageSize: 0,
    isTableLoading: false
  };
  constructor(
    private api: ShopProxyService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {

  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.getList().subscribe(res => {
      console.log(res);
      this.dataItems = res.items;
    })
  }

  create() {
    const modal = this.modalService.create({
      nzTitle: '新建商家',
      nzContent: ShopEditComponent,
      nzComponentParams: {
        form: {
          name: "",
          shortName: "",
          coverImage: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          description: ""
        }
      },
      nzFooter: [
        {
          label: '确定',
          onClick: instance => {
            console.log("componentInstance", instance);
            if (instance.f.valid) {
              this.api.create({ body: instance.form }).subscribe(res => {
                this.message.success("新建成功");
                this.refresh();
                modal.destroy();
              })
            }
            else {
              instance.f.ngSubmit.emit(null)
              this.message.error("表单错误")
            }
          }
        }
      ]
    });
    modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));
  }

  edit(shop: ShopDto) {
    const modal = this.modalService.create({
      nzTitle: '编辑商家',
      nzContent: ShopEditComponent,
      nzComponentParams: {
        id: shop.id!,
        form: { ...shop }
      },
      nzFooter: [
        {
          label: '确定',
          type: "primary",
          onClick: instance => {
            console.log("componentInstance", instance);
            if (instance.f.valid) {
              this.api.update({ id: instance.id, body: instance.form }).subscribe(res => {
                this.message.success("修改成功");
                this.refresh();
                modal.destroy();
              })
            }
          }
        }
      ]
    });
    modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));
  }
  delete(shop: ShopDto) {
    this.api.delete(shop).subscribe(res => {
      this.message.success("删除成功");
      this.refresh();
    })
  }
}
