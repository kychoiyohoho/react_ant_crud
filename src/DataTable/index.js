import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Popconfirm, Space, Table, Form, Input } from "antd";
import { isEmpty } from "lodash";
import { Field } from "rc-field-form";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter  from "react-highlight-words";

export const DataTable = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [form] =Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState("");
  let [filteredData] = useState();
/*
1:20 에서 멈춤

search Icon 이 안나와서 헤메는중

*/





  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(false);
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    setGridData(response.data);
  };

  const isEditing = (record) => {
    return record.key === editRowKey;
  };
  const dataWithAge = gridData.map((item) => ({
    ...item,
    age: Math.floor(Math.random() * 9) + 20,
  }));
  const handleDelete = (value) => {
    const dataSource = [...modifiedData];
    const filteredData = dataSource.filter((item) => item.id !== value.id); //한 행데 대한 데이터에서 id랑 item.id 해서 일치 하지 않은 데이터만 출력한다.
    setGridData(filteredData);
  };
  const modifiedData = dataWithAge.map(
    (
      { body, ...item } //body console로 찍어 봤는데, undefined 이다
    ) => ({
      ...item,
      key: item.id,
      message: isEmpty(body) ? item.message : body,
    })
  );
const cancel =()=>{
    setEditRowKey("");
};
const save = async(key)=>{
try{
     const row = await form.validateFields();
     const newData = [...modifiedData];
     const index = newData.findIndex((item)=> key === item.key);
     if(index > -1){
        const item = newData[index];
        newData.splice(index,1,{...item,...row});
        setGridData(newData);
        setEditRowKey("");
     }
}catch(error){
    console.log("error",error);

}
};
//sorter 하면 나오는 데이터랑 ...sorter 하면 나오는 데이터는 다름
const handleChange=(...sorter) =>{
    //console.log("sorter",sorter)
    const {order, field} = sorter[2];
    setSortedInfo({columnKey: field, order});
}

const handleSearchCol =(selectedKeys, confirm, dataIndex) =>{
    confirm();
    setSearchColText(selectedKeys[0]);
    setSearchedCol(dataIndex);

};
const handleResetCol =(clearFilters)=>{
    clearFilters();
    setSearchColText("");
}
const getColumnSearchProps =(dataIndex)=>({
    filterDropDown:({
         setSelectedKeys,
         selectedKeys,
         confirm,
         clearFilters
    }) =>(
        <div style={{padding:0}}>
            <Input 
                placeholder={`Search ${dataIndex }`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value]:[])}
                onPressEnter={()=>handleSearchCol(selectedKeys, confirm, dataIndex)}
                style={{width:188, marginBottom:0, display:"block"}}
           />
           <Space>
            <Button type="primary" onClick={()=>handleSearchCol(selectedKeys, confirm, dataIndex)} 
            icon={<SearchOutlined />}
            size="small"
            style={{width:90}}
            >
                Search
            </Button>
            <Button type="primary" onClick={()=>handleResetCol(clearFilters)} 
            size="small"
            style={{width:90}}
            >
                Search
            </Button>
           </Space>
        </div>
    ),
    filterIcon:(filtered) =>(
        <SearchOutlined style={{color:filtered ? "#1890ff":undefined}} />
    ),
    onFilter:(value, record) =>
    record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()): "",

    render:(text) => searchedCol === dataIndex ? (
        <Highlighter 
            highlightStyle={{backgroundColor: "#ffc069", padding:0}}
            searchWords={[searchColText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
        />
    ) :(text),
});
const edit =(record)=>{
    form.setFieldsValue({
        name:"",
        email:"",
        message:"",
        ...record,
    });
    setEditRowKey(record.key)
};
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      editTable: true,
      sorter:(a,b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ...getColumnSearchProps("name")
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editTable: true,
      sorter:(a,b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order,
      ...getColumnSearchProps("email")
    },
    {
      title: "Age",
      dataIndex: "age",
      align: "center",
      editTable: false,
      sorter:(a,b) => a.age.length - b.age.length,
      sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,

    },
    {
      title: "Message",
      dataIndex: "message",
      align: "center",
      editTable: true,
      sorter:(a,b) => a.message.length - b.message.length,
      sortOrder: sortedInfo.columnKey === "message" && sortedInfo.order,
      ...getColumnSearchProps("message")
      
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedData.length >= 1
          ? (
            //console.log(record), //한 행에 대한 데이터가 출력된다
            (
              <Space>
                <Popconfirm
                  title="정말 삭제하시겠습니까?"
                  onConfirm={() => handleDelete(record)}
                >
                  <Button danger type="primary" disabled={editable}>
                    Delete
                  </Button>
                </Popconfirm>
                {editable ? (
                  <span>
                    <Space size="middle">
                      <Button onClick={()=>save(record.key)} type="primary" style={{marginRight:8}}>Save</Button>
                      <Popconfirm title="취소하시겠습니까?" onConfirm={cancel}>
                        <Button>Cancel</Button>
                      </Popconfirm>
                    </Space>
                  </span>
                ) : (
                  <Button
                    onClick={() => edit(record)}
                    type="primary"
                  >
                    Edit
                  </Button>
                )}
              </Space>
            ))
          : null;
      },
    },
  ];
  const mergedColumns = columns.map((col)=>{
    if(!col.editTable){
        return col;
    }
    return {
        ...col,
        onCell:(record) =>({
            record,
            dataIndex:col.dataIndex,
            title:col.title,
            editing: isEditing(record)
        })
    }
  });
  const EditableCell=({
    editing, dataIndex, title, record, children, ...restProps
  })=>{
    const input = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item name={dataIndex} style={{margin:0}} rules={[{
                    required:true,
                    message:`Please input ${title}`
                }]}>
                    {input}
                </Form.Item>
            ):(children)}

        </td>
    )
  }
  const reset =()=>{
    setSortedInfo({});
    setSearchText("");
    loadData();
  }
  const handleInputChange=(e)=>{
    setSearchText(e.target.value);
    if(e.target.value ===""){
        loadData();
    }
  }
  const globalSearch =()=>{
    filteredData = modifiedData.filter((value)=>{ 
        return(
            value.name.toLowerCase().includes(searchText.toLowerCase()) ||
            value.email.toLowerCase().includes(searchText.toLowerCase()) ||
            value.message.toLowerCase().includes(searchText.toLowerCase()) 
        );
    });
 
    setGridData(filteredData);
  }
  return (
    <div>
        <Space style={{marginBottom:16}}>
            <Input
            placeholder="Enter Search Text"
            onChange={handleInputChange}
            type="text"
            allowClear
            value={searchText}
    />
            <Button onClick={globalSearch} type="primary">Search</Button>
            <Button onClick={reset}>Reset</Button>
        </Space>
        <Form form={form} component={false}>
      <Table
        columns={mergedColumns}
        components={{
            body:{
                cell:EditableCell,
            }
        }}
        dataSource={filteredData && filteredData.length ? filteredData : modifiedData }
        bordered
        loading={loading}
        onChange={handleChange}
      />
      </Form>
    </div>
  );
};
