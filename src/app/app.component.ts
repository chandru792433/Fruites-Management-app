import { Component, OnInit } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import { ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Fruits_details';
  displayedColumns: string[] = ['productName', 'category', 'freshness', 'date','price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


constructor(private dialog:MatDialog,private api:ApiService){

}
  ngOnInit(): void {
   this.getAllProduct();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save')
      this.getAllProduct();
    })
  }

  getAllProduct(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{

      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllProduct();
      }
    })
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id)
    .subscribe({
    next:(res)=>{
      alert("Product deleted Succesfully");
      this.getAllProduct();
    },
    error:()=>{
      alert("Error while deleting the record");
    }
    })
  }
}
